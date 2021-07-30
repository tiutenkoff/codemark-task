import React from 'react';
import axios from 'axios';

import { Alert } from './components/Alert';
import { Button } from './components/Button';
import { Image } from './components/Image';

type stateAlert = {
  title: string,
  isShow: boolean,
}

interface IImages {
  title: string,
  image_url: string,
  id: number,
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [alert, setAlert] = React.useState<stateAlert>({title: '', isShow: false});
  const [isLoading, setIsLoading] = React.useState(false);
  const [images, setImages] = React.useState<Array<IImages>>([]);
  const [isGrouped, setIsGrouped] = React.useState(false);
  const [titleForGroup, setTitleForGroup] = React.useState<Array<string>>([])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const showAlert = (title: string) => {
    setAlert(prev => ({
      ...prev,
      title,
      isShow: true,
    }));
    setTimeout(() => {
      setAlert(prev => ({
        ...prev,
        isShow: false,
      }));
    }, 3000)
  };

  const DataFetching = async () => {
    try {
      const { data: { data: images } } = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=2xpZwZQPuuGapGhQAbnB7HFvk17oB5ue&tag=${inputValue}`);
      if (!images.image_url) {
        showAlert('По тегу ничего не найдено');
      }
      else {
        setImages(prev => ([
          ...prev, {
            title: inputValue.toLocaleLowerCase(),
            image_url: images.image_url,
            id: Date.now(),
          }
        ]))
        setTitleForGroup((): any => {
          if (!titleForGroup.includes(inputValue.toLocaleLowerCase())) {
            return [...titleForGroup, inputValue.toLocaleLowerCase()];
          }
          else {
            return [...titleForGroup];
          }
        })
      }
    } catch (error) {
      showAlert('Произошла http ошибка');
    }
  };

  const RequestGiphy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!inputValue.length) {
        showAlert('заполните поле "тег"!');
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
  console.log(titleForGroup);

  const groupImages = () => {
    setIsGrouped(prev => prev = !prev);
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
            <Button disabled={isLoading} onDownload={RequestGiphy} color={'success'} title={isLoading ? 'Загрузка...' : 'Загрузить'}/>
            <Button onGroup={removeAll} color={'danger'} title={'Очистить'}/>
            <Button isGrouped={groupImages} color={'primary'} title={isGrouped ? 'Разгруппировать' : 'Группировать'}/>
          </form>
          <ul className="list">
            {
              isGrouped
                ? titleForGroup.map(title => {
                  return (
                    <div className="list__grouped">
                      <div className="list__title">{title}</div>
                      <div className="list__images">
                        {
                          images.map(image => {
                            return image.title === title && <Image key={image.id} image_url={image.image_url} />
                          })
                        }
                      </div>
                    </div>
                  )
                })
                : images.map(image => (
                    <Image key={image.id} image_url={image.image_url}/>
                  ))
              
            }
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
