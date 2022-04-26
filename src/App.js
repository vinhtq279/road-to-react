import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';

const useSemiPersistentState = (key, initialState ) => {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {localStorage.setItem(key, searchTerm)}, [searchTerm, key]);
  return [searchTerm, setSearchTerm];
}

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
];

//const getAsyncStories = () => {return Promise.resolve({data: {stories: initialStories}})};
const getAsyncStories = () => {return new Promise((resolve) => {setTimeout(() => resolve({data: {stories: initialStories}}), 3000)})};

function App(){
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleRemoveStory = item => {
    const newStories = stories.filter((story) => {return story.objectID != item.objectID});
    setStories(newStories);
  };

  const handleSearch = (event) =>{
    setSearchTerm(event.target.value);
  }
  useEffect(() => {localStorage.setItem('search', searchTerm)}, [searchTerm]);
  useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
    .then(
      (result) => {
        setStories(result.data.stories);
        setIsLoading(false);
      })
    .catch(() => {
        setIsError(true)
    })
  }, [searchTerm]);
  const searchStories = stories.filter((story) => {return story.title.toLowerCase().includes(searchTerm.toLowerCase())});
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search" label="Search" value={searchTerm} onInputChange={handleSearch}>
        <strong>Search</strong>
      </InputWithLabel>
      <hr />
      {isLoading?(<p>Loading...</p>):(<List list={searchStories} onRemoveItem={handleRemoveStory} />)}
      
    </div>
  );
}

const InputWithLabel = ({id, children, type='text', value, onInputChange}) => {
  return(
    <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input id={id} type={type} value={value} onChange={onInputChange} />
    </>
  );

};

const List = ({list, onRemoveItem}) => {

  const tmpList =  list.map((item) => 
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
  );
  console.log(tmpList);
  return tmpList;
}

const Item  = ({item, onRemoveItem}) => {
  return (
    <div>
      <span><a href={item.url}>{item.title} </a></span>
      <span>{item.author} </span>
      <span>{item.num_comments} </span>
      <span>{item.points} </span>
      <span>
        <button type="button" onClick={() => {onRemoveItem(item)}}>
          Dismiss
        </button>
      </span>
    </div>
  );
}

const Search = ({search, onSearch}) => {
  return (
    <>
      <label htmlFor={search}>Search: </label>
      <input type='text' id="search" onChange={onSearch} value={search} />
    </>
  )
}
export default App;
