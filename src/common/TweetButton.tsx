import React, { useEffect } from 'react';

export interface TweetButtonProps {
    text: string;
    hashtags: string;
}

export class TweetButton extends React.Component<TweetButtonProps> {
    componentDidMount() {
        // @ts-ignore
        twttr.widgets.load(this.refs.TweetButton);
    }

    render() {
        return (
            <a ref="TweetButton"
                href="https://twitter.com/share"
                data-text={this.props.text}
                data-hashtags={this.props.hashtags}
                className="twitter-share-button"
                data-show-count="false">Tweet</a>
        );
    }
}