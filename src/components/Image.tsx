import React from 'react';

type ImageProps = {
    image_url: string,
}

export const Image: React.FC<ImageProps> = ({ image_url, }) => {
    return (
        <div className="list__item">
            <img src={image_url} alt="image" />
        </div>
    )
}
