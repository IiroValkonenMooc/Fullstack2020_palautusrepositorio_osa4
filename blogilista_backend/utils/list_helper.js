const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    } else if (blogs.length === 1) {
        return blogs[0].likes
    } else {
        const likes = blogs.map(blog => blog.likes).reduce((acc, curr) => Number(acc + curr) )

        return likes
    }
}

const favoriteBlog = (blogs) => {
    //console.log('blogs >> ', blogs)

    if(blogs.length === 0){
        return {}
    } else if (blogs.length === 1){
        return blogs[0]
    } else {
        const maxValue =  Math.max(...blogs.map(blog => blog.likes))
        const maxLikedBlogs = blogs.filter( blog => blog.likes === maxValue )

        return maxLikedBlogs[0]
    }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return {}
    }

    let uniqueAuthors = []

    for (let i = 0; i < blogs.length; i++) {
        if( !(uniqueAuthors.includes(blogs[i].author)) ) {
            uniqueAuthors.push(blogs[i].author)
        }
    }

    let authorsAndNumberOfblogs = []

    for (let ua_i = 0; ua_i < uniqueAuthors.length; ua_i++) {
        let numberOfBlogs = 0
        for (let b_i = 0; b_i < blogs.length; b_i++) {
            if(blogs[b_i].author === uniqueAuthors[ua_i]){
                numberOfBlogs++
            }
        }

        authorsAndNumberOfblogs.push(
            {
                author: uniqueAuthors[ua_i],
                blogs: numberOfBlogs
            }
        )
    }

    authorsAndNumberOfblogs.sort((a,b) => b.blogs - a.blogs)

    return authorsAndNumberOfblogs[0]
}

const mostLikes = (blogs) => {
    if(blogs.length === 0){
        return {}
    }

    let uniqueAuthors = []

    for (let i = 0; i < blogs.length; i++) {
        if( !(uniqueAuthors.includes(blogs[i].author)) ) {
            uniqueAuthors.push(blogs[i].author)
        }
    }

    let authorsAndNumberOfLikes = []

    for (let ua_i = 0; ua_i < uniqueAuthors.length; ua_i++) {
        let numberOfLikes = 0
        for (let b_i = 0; b_i < blogs.length; b_i++) {
            if(blogs[b_i].author === uniqueAuthors[ua_i]){
                numberOfLikes += blogs[b_i].likes
            }
        }

        authorsAndNumberOfLikes.push(
            {
                author: uniqueAuthors[ua_i],
                likes: numberOfLikes
            }
        )
    }

    authorsAndNumberOfLikes.sort((a,b) => b.likes - a.likes)

    return authorsAndNumberOfLikes[0]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}