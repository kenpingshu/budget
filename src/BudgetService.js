const dayjs = require('dayjs');
const BudgetRepo = require('./BudgetRepo');
class BudgetService {
	
	query(start, end) {
		const startDate = dayjs(start);
		const endDate = dayjs(end)
		if (endDate.isBefore(startDate)) {
			return 0
		}
		const budgetRepo = new BudgetRepo();
		const budgets = budgetRepo.getAll()
		console.log({budgets})
		const keys = this.getKeys(startDate, endDate)
		const searchResult = budgets.filter((budget) => {
			return keys.indexOf(budget.yearMonth) > -1
		})
		if (searchResult.length === 0) {
			return 0
		}
		if(keys.length === 1){
			const days = endDate.diff(startDate, 'day') + 1
			return searchResult[0].dayBudget() * days
		}
		let totalBudget = 0
		searchResult.forEach((budget,index)=>{
			if(index === 0){
				const monthEnd = dayjs(budget.yearMonth).endOf('month')
				totalBudget += (monthEnd.diff(startDate, 'day') + 1) * budget.dayBudget()
			}else if(index===searchResult.length-1){
				const monthStart = dayjs(budget.yearMonth).startOf('month')
				totalBudget += (endDate.diff(monthStart, 'day') + 1) * budget.dayBudget()
			}else{
				totalBudget += budget.amount
			}
		})
		return totalBudget;
	}
	
	getKeys(startDate, endDate) {
		startDate = startDate.startOf('month')
		endDate = endDate.startOf('month')
		let result = []
		while(endDate.unix() >= startDate.unix()){
			result.push(startDate.format('YYYYMM'))
			startDate = startDate.add(1, 'month')
		}
		return result
	}
}

module.exports = BudgetService