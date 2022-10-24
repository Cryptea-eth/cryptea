const axios = import('axios');

const main = async () => {
   return await axios.get('/remind');
}

main().then(e => {
    console.log(e)
}).catch(err => {
    console.log(err)
})
