

def total_contributions(contributions):
    total = 0
    for contribution in contributions:
        total += contribution.amount
    return total