class GenerateUserChartsUseCase:
    def __init__(self, repository):
        self.repository = repository

    async def execute(self, user_id: str):
        raw_stats = await self.repository.get_user_expenses_by_category(user_id)
        
        # Calculamos el total general para sacar porcentajes
        total_general = sum(item['amount'] for item in raw_stats)
        
        formatted_stats = []
        for item in raw_stats:
            formatted_stats.append({
                "category": item["category"],
                "amount": item["amount"],
                "percentage": round((item["amount"] / total_general) * 100, 2) if total_general > 0 else 0
            })
            
        return {
            "total_spent": total_general,
            "by_category": formatted_stats,
            "monthly_trend": [ # Ejemplo estático para que pruebes tu gráfica de barras
                {"month": "Ene", "total": 1200},
                {"month": "Feb", "total": 1900},
                {"month": "Mar", "total": 1500}
            ]
        }