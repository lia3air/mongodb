const mongoose = require('mongoose');
const express = require('express')
const User = require('./schema/user');
const Board = require('./schema/board');


const server = express()
// Parse JSON bodies for this server ... access via request.body,
server.use(express.json());
const port = 3000
// get - lesen
// post - create
// put - update / create
// delete - löschen
/**
 * Parameter (here name) in query string.
 */
server.get('/users', async (req, res) => {
    const {name} = req.query;
    const filter = {};
    if(name){
        filter['firstname'] = name;
    }
    const users = await User.find(filter);
    res.send(users);
})
/**
 * Parameter (here id) in path.
 */
server.get('/users/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findOne({_id: id});
        res.send(user);
    } catch (e){
        res
            .status(404)
            .send('Not found.');
    }
})

server.post('/newPostit/:id', async (req, res) => {
    const {id} = req.params;
    const postit = req.body;
    console.log(postit)
    try {
        const board = await Board.findOne({_id: id});

        board.postits.push({
            text: postit.text,
            author:postit.author,
            position: {
                x:postit.x,
                y:postit.y
            }
        })

        board.save();

        res.send('funktioniert');
    } catch (e){
        res
            .status(404)
            .send('Not found.');
    }


    /* Example Body

    {
    "text":"postit2",
    "author":"60b4fd483685f737bb3d54c5",
    "x":"1",
    "y":"0"
    }

    */
})

server.post('/newEditor', async (req, res) => {

    const editorData = req.body;

    try {
        const board = await Board.findOne({_id: editorData.idBoard});
        console.log(board)
        console.log(board.editor)

        board.editor.push(editorData.idEditor);

        console.log(board);
        await board.save();

        res.send('funktioniert');
    } catch (e){

        console.log(e);

        res
            .status(404)
            .send('Not found.');
    }

    /* Example Body

    {
    "idBoard":"60b768ba4eae210a4730c8c6",
    "idEditor":"60b4be6e4bacd434f4998da9"
    }

    */
})




server.post('/newBoard', async (req, res) =>{
    const boardData = req.body;
    console.log(boardData);
    try{
        const board = new Board({
            postits: [],
            owner:boardData.owner,
            editor:[boardData.owner]
        });

        await board.save();

        res.send('funktioniert')
    }catch (e) {
        res
            .status(409)
            .send('konnte nicht erstellt werden');
    }

    /* Example Body

   {
    "owner":"60b4fd37c9f5db37b7999c54"
   }

   */


})

server.delete('/deleteEditor', async (req, res) => {

    const editorData = req.body;

    try {
        const board = await Board.findOne({_id: editorData.idBoard});

        console.log(board.editor);

        let editor = editorData.idEditor;
        console.log(editor);



       for(let i=0;i < board.editor.length; i++){
           if (editor==board.editor[i]){

                board.editor.splice([i]);

                board.save();

               console.log(board.editor);
           }else {
               console.log(board.editor[i]);
           }
       }


        res.send('funktioniert');
    } catch (e){
        res
            .status(404)
            .send('Not found.');
    }

    /* Example Body

  {
    "idBoard":"60b4f5b4a7031b36ce8ce44a",
    "idEditor":"60b4fd37c9f5db37b7999c54"
   }

  */
})

server.delete('/deletePostit', async (req, res) => {

    const postitData = req.body;

    try {
        const board = await Board.findOne({_id: postitData.idBoard});

        let postIt = postitData.postitid;

        for(let i=0;i < board.postits.length; i++){
            if (postIt==board.postits[i]._id){
                board.postits.splice(i,1);

                await board.save();
                break


            }else {
                console.log('nichts');
            }
        }


        res.send('funktioniert');
    } catch (e){
        res
            .status(404)
            .send('Not found.');
    }

    /* Example Body

   {
    "text":"postit2",
    "author":"60b4fd483685f737bb3d54c5",
    "x":"1",
    "y":"0"

    }

    */
})

server.put('/updatePostit', async (req, res) => {

    const postitData = req.body;

    try {
        const board = await Board.findOne({_id: postitData.idBoard});

        let postIt = postitData.postitid;

        console.log(board);

        for(let i=0;i < board.postits.length; i++){
            if (postIt==board.postits[i]._id){

                board.postits[i].overwrite({
                    text: postitData.text,
                    author:postitData.author,
                    position: {
                        x:postitData.x,
                        y:postitData.y
                    }


                });

                console.log(board);
                await board.save();
                break


            }else {
                console.log('nichts');
            }
        }


        res.send('funktioniert');
    } catch (e){
        res
            .status(404)
            .send('Not found.');
    }

    /* Example Body

   {
    "postitid":"60b78b49a22ba20d9168491a",
    "idBoard":"60b7826b9f1e5f0c80995205",
    "text":"update",
    "author":"60b4fd483685f737bb3d54c5",
    "x":"1",
    "y":"0"
    }

    */


})

server.delete('/deleteBoard/:id', async (req, res) => {

    const {id} = req.params;

    try {
        Board.deleteOne({ _id: id }, function (err) {
            if(err) console.log(err);
            console.log("Successful deletion");
        });

        res.send('funktioniert');
    } catch (e){
        res
            .status(404)
            .send('Not found.');
    }


})


mongoose.connect('mongodb://localhost:27017', {
    user: 'root',
    pass: 'example',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, error => {
    if(!error) {
        server.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    } else {
        console.error('Failed to open a connection to mongo db.', error);
    }
});