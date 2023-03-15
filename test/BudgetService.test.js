const BudgetService = require('../src/BudgetService');
const BudgetRepo = require('../src/BudgetRepo');
const Budget = require("../src/Budget");
jest.mock("../src/BudgetRepo");


describe('Budget Service', function () {
	let budgetService
	beforeEach(() => {
		budgetService = new BudgetService();
	});
	
	function givenBudgetFromDB(budgets) {
		BudgetRepo.mockImplementationOnce(() => {
			return {
				getAll: () => {
					return budgets
				}
			};
		});
	}
	
	it('should return 0 when invalid date', function () {
		const result = budgetService.query('20230302', '20230301');
		expect(result).toBe(0)
	});
	
	it('should return 0 when budget data is empty', function () {
		givenBudgetFromDB([])
		const result = budgetService.query('20230401', '20230402');
		expect(result).toBe(0)
	});
	
	it('should return 310', function () {
		givenBudgetFromDB([new Budget('202301', 310), new Budget('202302', 560), new Budget('202303', 930)])
		const result = budgetService.query('20230101', '20230131');
		expect(result).toBe(310)
	});
	
	it('should return 50', function () {
		givenBudgetFromDB([new Budget('202301', 310), new Budget('202302', 560), new Budget('202303', 930)])
		const result = budgetService.query('20230131', '20230202');
		expect(result).toBe(50)
	});
	
	it('should return 50', function () {
		givenBudgetFromDB([new Budget('202301', 310), new Budget('202302', 560), new Budget('202303', 930)])
		const result = budgetService.query('20230131', '20230302');
		expect(result).toBe(560+10+60)
	});
});