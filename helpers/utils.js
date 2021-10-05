const checkUrl = (url) => {
    const re = new RegExp("^(http|https)://", "i")
    const placeholderUrl = 'https://www.glamflame.net/wp-content/uploads/2020/01/Image-Placeholder.png'
    const isValidUrl = re.test(url);
    return isValidUrl ? url : placeholderUrl
}

module.exports = checkUrl