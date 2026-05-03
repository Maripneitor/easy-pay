class GenerateUserChartsUseCase:
    def __init__(self, repository):
        self.repository = repository

    async def execute(self, user_id: str):
        # 1. Obtener gastos por categoría
        categories_data = await self.repository.get_user_expenses_by_category(user_id)
        
        # 2. Obtener balances reales (deuda vs favor)
        balances = await self.repository.get_user_balances(user_id)
        
        # 3. Obtener tendencia mensual
        trend = await self.repository.get_monthly_trend(user_id)
        
        total_spent = sum(item['amount'] for item in categories_data)
        
        formatted_categories = []
        for item in categories_data:
            formatted_categories.append({
                "category": item["category"],
                "amount": item["amount"],
                "percentage": round((item["amount"] / total_spent) * 100, 1) if total_spent > 0 else 0
            })
            
        return {
            "total_spent": round(total_spent, 2),
            "owed_to_user": balances["owed_to_user"],
            "user_owes": balances["user_owes"],
            "by_category": formatted_categories,
            "monthly_trend": trend
        }