import React from 'react';
import axios from 'axios';

import { Alert } from './components/Alert';
import { Button } from './components/Button';
import { Image } from './components/Image';

type stateAlert = {
  title: string,
  isShow: boolean,
}

export interface IImages {
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
  const [isRemoveDelay, setIsRemoveDelay] = React.useState(false);
  const [isAddDelay, setIsAddDelay] = React.useState(false);
  const timerToClearSomewhere = React.useRef<any>();

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

  const clickOnImage = (title: string) => {
    setInputValue(title);
  };

  function getRandomNumber(): number {
    return Math.random() * (10 - 1) + 1;
  }

  function makeRandTag(): string {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,";
    for (let i = 0; i < getRandomNumber(); i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  const DataFetching = async (delayTag: string = '') => {
    try {
      if (delayTag.length) {
        setInputValue(delayTag);
      }
      inputValue.split(',').forEach((item) => {
        axios.get(`https://api.giphy.com/v1/gifs/random?api_key=2xpZwZQPuuGapGhQAbnB7HFvk17oB5ue&tag=${item}`)
          .then(({ data: { data } }) => {
            const { image_url } = data;
            if (!image_url) {
              showAlert('По тегу ничего не найдено');
            }
            else {
              setImages(prev => ([
                ...prev, {
                  title: inputValue.toLocaleLowerCase(),
                  image_url,
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
          });
      })
    } catch (error) {
      showAlert('Произошла http ошибка');
    }
  };
  
  React.useEffect(() => {
    async function fetch() {
      timerToClearSomewhere.current = setInterval(async () => {
           setIsLoading(true);
           await DataFetching(makeRandTag());
           if (isRemoveDelay) {
             clearInterval();
           }
         }, 5000)
    }
    if (isAddDelay !== false) {
      fetch();
    }
  }, [isAddDelay])

  React.useEffect(() => {
    if (isAddDelay === false) {
      return () => {
        clearInterval(timerToClearSomewhere.current)
        setIsLoading(false);
      }
    }
  }, [isRemoveDelay])


  const RequestGiphy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!inputValue.length) {
      showAlert('заполните поле "тег"!');
    } else {
      if (inputValue.toLowerCase() === 'delay') {
        setIsAddDelay(true);
      } else {
        if (inputValue.match('[a-zA-Z,]+')) {
          setIsLoading(true);
          await DataFetching();
          setIsLoading(false);
        }
        else {
          showAlert('Ввод любых символов в поле кроме букв латинского алфавита и “,” запрещен');
        }
      }
    }
  };

  const removeAll = () => {
    setInputValue('');
    setImages([]);
    setIsGrouped(false);
    setIsRemoveDelay(true);
    setTitleForGroup([]);
  };
  

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
            <Button sumbit={true} onDownload={RequestGiphy} disabled={isLoading}  color={'success'} title={isLoading ? 'Загрузка...' : 'Загрузить'} />
            <Button onGroup={removeAll} color={'danger'} title={'Очистить'} />
            <Button disabled={!images.length} isGrouped={groupImages} color={'primary'} title={isGrouped ? 'Разгруппировать' : 'Группировать'}/>
          </form>
          <ul className="list">
            {
              isGrouped
                ? titleForGroup.map(title => {
                  return (
                    <div key={title + 'key'} className="list__grouped">
                      <div className="list__title">{title}</div>
                      <div className="list__images">
                        {
                          images.map(image => {
                            return image.title === title
                              && <Image
                                onClick={clickOnImage}
                                title={image.title}
                                key={image.id}
                                image_url={image.image_url}
                              />
                          })
                        }
                      </div>
                    </div>
                  )
                })
                : images.map(image => (
                  <Image
                    onClick={clickOnImage}
                    key={image.id}
                    title={image.title}
                    image_url={image.image_url}
                  />
                  ))
            }
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
