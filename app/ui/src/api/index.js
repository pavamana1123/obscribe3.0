class API {
    constructor(body){
        this.body = body
    }
   
    async call(path){
        var self = this
        const res = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                path,
            },
            body: JSON.stringify(self.body||{}),
        })

        return res.json().then((r)=>{
            return {
                status: res.status,
                body: r,
                error: r.error
            }
        })
    }
}


export default API