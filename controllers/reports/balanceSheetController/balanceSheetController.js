
import Bill from "../../../models/bills/Bill.js";
import Bank from "../../../models/banking/Bank.js";
import Cash from "../../../models/cash/Cash.js";
import Truck from "../../../models/assets/Truck.js";

const balanceSheetController = {


    index: async (req, res) => {

        const billsQuery = await Bill.find({});
        const banks = await Bank.find({});
        const cash = await Cash.find({name: 'cashAccount'});
        const trucks = await Truck.find({deleted: 0});


        const thisYear = new Date().getFullYear();


        //Bills
        const billsArray = [0];
        const bills = billsQuery.filter(bill => {
            return parseFloat(bill.amount) > parseFloat(bill.paid) && new Date(bill.date).getFullYear() === thisYear;
        })

        for (const bill of bills){
            billsArray.push(parseFloat(bill.amount) - parseFloat(bill.paid));
        }
        const totalBills = billsArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        })

        //Banks
        const banksArray = [0];
        for (const bank of banks){
            banksArray.push(parseFloat(bank.balance))
        }
        const totalBankBalance = banksArray.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        })

        //Total Cash
        const totalCash = parseFloat(cash[0].balance);


        //depreciation
        function depreciation(dateFrom, dateTo, amount, depreciation) {
            const monthsElapsed = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
            const aa = monthsElapsed * parseFloat(depreciation);
            const depreciatedBy = (aa / 100) * parseFloat(amount);
            return parseFloat(amount) - depreciatedBy;
        }

        const trucksArray = [0];

        for (const truck of trucks){
          const dep =  depreciation(truck.datePurchased, new Date(), parseFloat(truck.amount), parseFloat(truck.depreciation));
           trucksArray.push(parseFloat(dep));
        }

       const totalTrucksAfterDepreciation = trucksArray.reduce((previousValue, currentValue) => {
           return previousValue + currentValue;
       })


        res.render('admin/reports/balanceSheet/index',
            {
                totalCash,
                totalBills,
                totalBankBalance,
                totalTrucksAfterDepreciation
            }
        );

    }



}



export default balanceSheetController;