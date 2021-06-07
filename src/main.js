const mongoose = require('mongoose');
Board = require('./schema/board');
User = require('./schema/user');

async function testMongoose() {

    try {
        await mongoose.connect('mongodb://localhost:27017',{
            user:'root',
            pass:'example',

            useNewUrlParser:true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });


        const user = new User({
            name: {
                firstname:'paul'

            }
        });

        await user.save();
        const author = await User.findOne({'name.lastname':'test'});


        const board = new Board({
            postits: [{
                text:'das ist der Text',
                author:author._id,
                position: {
                    x:0,
                    y:1
                }
            }],
            owner:author._id,
            editor:author._id
        });






    }catch (e) {
        console.error(e)
    }finally {
        await mongoose.disconnect();
    }

}

testMongoose();
