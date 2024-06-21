const path = require("path")

module.exports.notFound = async (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/not_found.html"))
}
