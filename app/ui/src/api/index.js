class API {
    constructor(body){
        this.body = body
    }
   
    async call(){
        var self = this
        console.log(self.body)
        const res = await fetch('http://127.0.0.1:8000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(self.body||{}),
            mode: 'no-cors' 
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