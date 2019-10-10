#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""SUSHI_UPDATE: Fetch Sushi Information from SUSHIRO."""

import datetime
import json
import re
import sys

import requests

SSR_MENU_TOP = "https://www.akindo-sushiro.co.jp/m/menu/"
RE_KEY = '<a href="([^"]*)"'

CAT_KEY = '<!--Contents-->[ \t\r\n]*<div[^>]*>([^<]*)</div'
ITEM_KEY = '<td[^>]*>[ \t]*<div[^>]*>([^<]*)</div.*?([0-9]+)円.*?([0-9]+)kcal.*?<a href="([^"]*)"'
ID_KEY = "^detail.php\?id=([0-9]+)&mcat=([0-9]+)"
HAS_NEXT = '<a[^>]*>[ \t\r\n]*<span[^>]*>次へ</span>'

# fail safe
CAT_MAX = 8
PAGE_MAX = 16


def main():
    with prepare_log() as log:
        try:
            # fetch top of menu
            resp = requests.get(SSR_MENU_TOP)
            resp.raise_for_status()
            links = re.findall(RE_KEY, resp.text)
            categories = list(
                [t for t in links if t.startswith('category.php?')])
            if len(categories) == 0:
                raise ValueError('link of categories are not found.')
            elif len(categories) > CAT_MAX:
                raise ValueError('there are too much categories: {}, \
                                 threshold: {}.'.format(
                    len(categories), CAT_MAX))
            menus = {}
            # fetch categories
            for c in categories:
                key, items = fetch_category(SSR_MENU_TOP + c)
                menus[key] = items
            # dump into json
            with open('sushiro_menu.json', 'w', encoding='utf-8') as f:
                json.dump(menus, f, ensure_ascii=False, indent=2,
                          sort_keys=False, separators=(',', ': '))
        except:
            print(sys.exc_info())
            log.write(str(sys.exc_info()))


def fetch_category(category):
    print('* cat: ' + category)
    has_next = True
    page = 1
    items = []
    cat = None
    while has_next:
        cats, sub_items, has_next = fetch_page(category, page)
        assert len(cats) == 1, \
            'only one category should be contained in the page, but {} categories found: {}'.format(
                len(cats), cats)
        if cat is None:
            cat = cats[0]
        assert cat == cats[0], \
            'categories mismatched when fetching {}: returns {}'.format(
                cat, cats[0])
        if sub_items is None:
            break
        items.extend(sub_items)
        page += 1
        if page > PAGE_MAX:
            raise ValueError(
                'number of pages exceeds the limit of pages.')
    assert len(items) > 0, \
        'there must be more than one items in the category {}, but no items found.'.format(
            category)
    return cat, items


def fetch_page(category, page):
    print('  req: ' + category + '&page={}'.format(page))
    target = category
    if page > 1:
        target += '&page={}'.format(page)
    resp = requests.get(target)
    resp.raise_for_status()
    cats = re.findall(CAT_KEY, resp.text)
    if len(cats) == 0:
        return None, None, False
    items = decompose_items(resp.text)
    next = re.findall(HAS_NEXT, resp.text)
    has_next = len(items) > 0 and len(next) > 0
    return cats, items, has_next


def decompose_items(text):
    """Parse items into description tuple.

    Args:
        items: fetched string
    Returns:
        ("name of item", (category_id, item_id))
    """
    matches = re.findall(ITEM_KEY, text, flags=re.DOTALL)
    if len(matches) == 0:
        return []
    t_list = []  # type: List[SushiMenu]
    for match in matches:
        name = match[0]
        price = int(match[1])
        energy = int(match[2])
        link = match[3]
        id_and_cat = re.match(ID_KEY, link)
        id = int(id_and_cat[1])
        category = int(id_and_cat[2])
        t_list.append({
            "name": name,
            "price": price,
            "energy": energy,
            "link": link,
            "id": id,
            "cat": category
        })
    return t_list


def prepare_log():
    f = open('sushi_fetch.log', 'w')
    f.write('SUSHI: {}\n'.format(datetime.datetime.now()))
    return f


if __name__ == "__main__":
    main()
