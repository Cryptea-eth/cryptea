const Moralis = import('moralis')
const axios = import('axios');



const main = async () => {
        const Reminder = Moralis.Object.extends('link');
        const reminder = new Moralis.Query(Reminder);
        
        reminder.notEqualTo('subscribers', undefined)
        reminder.notEqualTo('subscribers', '');
        reminder.notEqualTo('subscribers', '[]');

        const results = await reminder.find();
        console.log(results)
        
        if(results.length){
        for (i = 0; i < results.length; i++) {
            const subs = JSON.parse(results[i]);
            for (ii = 0; ii < subs.length; ii++) {
                const { remind, mail, renewal, amount } = subs[ii];
                const exp = new Date(remind);
                const cdat = new Date();

                const parseCdat = Date.parse(`${cdat.getFullYear()}-${cdat.getMonth() + 1}-${cdat.getDate()}`);
                const parseExp = Date.parse(`${exp.getFullYear()}-${exp.getMonth() + 1}-${exp.getDate()}`)

                if (parseCdat == parseExp) {
                    
                    await axios.post('https://cryptea.me/expire', {
                            link: results[i].get('link'),     
                            mail,
                            renewal, 
                            amount,
                            full_link: '',
                            expiry: remind
                    });   
                }
            }
        }
    }else{
        return 'hmm...'
    }

}


main().then(e => {
    console.log(e)
}).catch(err => {
    console.log(err)
})
