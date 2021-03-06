module.exports.getFile = (request, reply) => {
    const { fileName } = request.params
    fileName = decodeURIComponent(fileName)
    const filePath = path.join('upload', fileName)

    return process.env.NODE_ENV === 'production' ? fetchFile(fileName).then(res => reply(res)) : reply.file(filePath)
}

const fetchFile = async (fileName) => {
    
}