import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import PropTypes from 'prop-types';
import config from '../config';
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };
  static contextType = BookmarksContext;

  state = {
    error: null,
    title: '',
    bookmark_url: '',
    description: '',
    rating: 1,
    id: ''
  }

  componentDidMount() {
      const { id } = this.props.match.params
      fetch(config.API_ENDPOINT + id, {
          method: 'GET',
          headers: {
              'content-type': 'application/json',
              'authorization': `bearer ${config.API_KEY}`
          }
      })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            const {title, bookmark_url, description, rating, id} = data
            this.setState({
                ...this.state,
                id,
                title,
                bookmark_url,
                description,
                rating
            })
        })
  }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, bookmark_url, description, rating, id } = this.state
    const newBookmark = { title, bookmark_url, description, rating, id } 

    fetch(config.API_ENDPOINT + id, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error
          })
        }
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.editBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      bookmark_url: newFields.bookmark_url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  updateTitle = (title) => {
      this.setState({...this.state, title})
  }

  updateUrl = (bookmark_url) => {
    this.setState({...this.state, bookmark_url})
  }

  updateRating = (rating) => {
    this.setState({...this.state, rating})
  }

  updateDescription = (description) => {
    this.setState({...this.state, description})
  }

  render() {
    const { error, title, bookmark_url, rating, description } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit Bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={title}
              onChange={e => {this.updateTitle(e.target.value)}}
              required
            />
          </div>
          <div>
            <label htmlFor='bookmark_url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='bookmark_url'
              id='bookmark_url'
              value={bookmark_url}
              onChange={e => {this.updateUrl(e.target.value)}}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={e => {this.updateDescription(e.target.value)}}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value={rating}
              min='1'
              max='5'
              onChange={e => {this.updateRating(e.target.value)}}
              required
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
