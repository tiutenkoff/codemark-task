import React from 'react';

type ImageProps = {
    title: string,
    image_url: string,
    onClick: (title: string) => void,
}
export const Image: React.FC<ImageProps> = ({ image_url, onClick, title=''}) => {
    return (
        <div className="list__item">
            <img className="list__gif" onClick={() => onClick(title)} src={image_url} alt="gifImg" />
        </div>
    )
}
