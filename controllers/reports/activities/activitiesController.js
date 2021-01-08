import Activity from "../../../models/activities/Activity.js";


const activitiesController = {

    index: async (req, res) => {


        res.render('admin/activities/index');

    },

    search: async (req, res) => {

        const{from, to, table} = req.body;

       Date.prototype.withoutTime = function (){
           let d = new Date(this);
           return d.setHours(0,0,0,0);
       }

        const activitiesQuery = await Activity.find({table}).populate('user');
        const activities = activitiesQuery.filter(act => {
            return new Date(act.createdAt).withoutTime() >= new Date(from).withoutTime()
                && new Date(act.createdAt).withoutTime() <= new Date(to).withoutTime()
        })

        res.render('admin/activities/index', {activities, table});
    }


}


export default activitiesController;