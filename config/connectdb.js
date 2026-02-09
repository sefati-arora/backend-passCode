const Sequelize=require("sequelize");
const sequelize=new Sequelize("passcodeDB","root","password",
    {
        host:"localhost",
        dialect:"mysql"
    }
);

const connectdb=async()=>
{
    await sequelize.authenticate().then(
        async()=>
        {
            await sequelize.sync({alter:false})
            console.log("DB CONNECTED AND SYNC")
        }
    ).catch((error)=>
    {
        console.log("error while connecting",error)
    })
}
module.exports=
{
    connectdb:connectdb,
    sequelize:sequelize
}