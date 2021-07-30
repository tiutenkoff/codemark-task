import React from 'react';
import axios from 'axios';

import { Alert } from './components/Alert';
import { Button } from './components/Button';

type stateAlert = {
  title: string,
  isShow: boolean,
}

interface IImages {
  image_url: string,
  id: number,
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [alert, setAlert] = React.useState<stateAlert>({title: '', isShow: false});
  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState<Array<IImages>>([]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const DataFetching = async () => {
    const { data } = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=2xpZwZQPuuGapGhQAbnB7HFvk17oB5ue&tag=${inputValue}`);
    console.log(data.data.image_url);
    setImages(prev => ([
      ...prev,{
        image_url: data.data.image_url,
        id: Date.now(),
      }
    ]))
    console.log(images);
  };

  const RequestGiphy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!inputValue.length) {
        setAlert(prev => ({
          ...prev,
          title: 'заполните поле тег!',
          isShow: true,
        }));
        setTimeout(() => {
          setAlert(prev => ({
            ...prev,
            isShow: false,
          }));
        }, 3000)


      } else {
        setIsLoading(true);
        await DataFetching();
        setIsLoading(false);
      }
  };

  const removeAll = () => {
    setInputValue('');
    setImages([]);
  };

  return (
    <>
      <div className="container">
        <div>
          {
            alert.isShow ? <Alert title={alert.title} /> : null
          }
          <form className="form">
            <input value={inputValue} onChange={handleInput} type="text" className="form__item form-control" placeholder="введите тег"/>
            <Button onDownload={RequestGiphy} color={'success'} title={isLoading ? 'Загрузка...' : 'Загрузить'}/>
            <Button onGroup={removeAll} color={'danger'} title={'Очистить'}/>
            <Button color={'primary'} title={'Групировать'}/>
          </form>
          {
            images.map(image => (
              <img key={image.id} src={image.image_url} alt="image" />
            ))
          }
        </div>
      </div>
    </>
  );
}

export default App;
