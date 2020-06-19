const dummy = (blogs) => {
    return 1
}

const totaltLikes = (blogs) => {
    if(blogs.count === 0){
        return 0
    }

    console.log(blogs)
    blogs.reduce((acc, curr) => {
        return acc + curr.likes
    })
}

module.exports = {
    dummy
}