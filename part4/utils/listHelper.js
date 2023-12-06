const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
		return sum + item
	}

	const blogLikes = blogs.map(blogs => blogs.likes)
  
	return blogLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
	const blogLikes = blogs.map(blogs => blogs.likes)
	const largestIndex = blogLikes.indexOf(Math.max(...blogLikes))
	const largestinfo = blogs[largestIndex]

	return {
		title: largestinfo.title,
		author: largestinfo.author,
		likes: largestinfo.likes,
	}
}

const mostBlogs = (blogs) => {
	const blogAuthor = blogs.map(blogs => blogs.author)
	
	let mode = 
		_.chain(blogAuthor)
			.countBy()
			.entries()
			.maxBy(_.last)
			.thru(_.head)
			.value();

	let count = 0;

	blogAuthor.forEach(element => {
  		if (element === mode) {
    	count += 1;
		}
	})
	
	return {
		author: mode,
		blogs: count,
	}
}

const mostLikes = (blogs) => {
	const blogGroup = _.groupBy(blogs, 'author')
	const authorCount = _.map(blogGroup, (arr) => { 
		return { 
			author: arr[0].author, 
			likes: _.sumBy(arr, 'likes'), 
		}; 
		
	})
	const maxLikesAuthor = _.maxBy(authorCount, (a) => a.likes)
	const authorName = _.head(_.values(maxLikesAuthor))

	return {
		author: authorName,
		likes: maxLikesAuthor.likes
	}
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes,
    mostBlogs
  }