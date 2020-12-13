import {exec} from "child_process";


const backupController = {
    backup: async (req, res) => {

        exec('mongodump --db haulage --out /home/innocent/Desktop/backup', (error, stdout, stderr) => {
            if (error){
                req.flash('error_msg', 'Sorry Database Backup Failed');
                return res.redirect('/');
            }

            req.flash('success_msg', 'Backup was successful');
            return res.redirect('/');

        });

    }
}


export default backupController;