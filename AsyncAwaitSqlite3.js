import  sqlite3  from "sqlite3"


const AA_SQLITE =  {
    db: null
}

AA_SQLITE.open=function(path) {
    return new Promise(function(resolve) {
    this.db = new sqlite3.Database(path, 
        function(err) {
            if(err) reject("Open error: "+ err.message)
            else    resolve(path + " opened")
        }
    )   
    })
}

// any query: insert/delete/update
AA_SQLITE.run=function(query) {
    return new Promise(function(resolve, reject) {
        this.db.run(query, 
            function(err)  {
                if(err) reject(err.message)
                else    resolve(true)
        })
    })    
}

// first row read
AA_SQLITE.get=function(query, params) {
    return new Promise(function(resolve, reject) {
        this.db.get(query, params, function(err, row)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(row)
            }
        })
    }) 
}

// set of rows read
AA_SQLITE.all=function(query, params) {
    return new Promise(function(resolve, reject) {
        if(params == undefined) params=[]

        this.db.all(query, params, function(err, rows)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    }) 
}

// each row returned one by one 
AA_SQLITE.each=function(query, params, action) {
    return new Promise(function(resolve, reject) {
        var db = this.db
        db.serialize(function() {
            db.each(query, params, function(err, row)  {
                if(err) reject("Read error: " + err.message)
                else {
                    if(row) {
                        action(row)
                    }    
                }
            })
            db.get("", function(err, row)  {
                resolve(true)
            })            
        })
    }) 
}

AA_SQLITE.close=function() {
    return new Promise(function(resolve, reject) {
        this.db.close()
        resolve(true)
    }) 
}

export default AA_SQLITE