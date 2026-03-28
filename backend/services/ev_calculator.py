from models.schemas import Game, EVResult


def american_to_implied_prob(price: int) -> float:
    if price > 0:
        return 100 / (price + 100)
    else:
        return abs(price) / (abs(price) + 100)


def remove_vig(home_prob: float, away_prob: float) -> tuple[float, float]:
    total = home_prob + away_prob
    return home_prob / total, away_prob / total


def calculate_ev(price: int, fair_prob: float) -> float:
    if price > 0:
        payout = price / 100
    else:
        payout = 100 / abs(price)
    return (fair_prob * payout) - ((1 - fair_prob) * 1)


def get_ev_results(games: list[Game]) -> list[EVResult]:
    results = []

    for game in games:
        if not game.odds:
            continue

        home_probs = []
        away_probs = []
        for book_odd in game.odds:
            if book_odd.home_price and book_odd.away_price:
                hp = american_to_implied_prob(book_odd.home_price)
                ap = american_to_implied_prob(book_odd.away_price)
                fh, fa = remove_vig(hp, ap)
                home_probs.append(fh)
                away_probs.append(fa)

        if not home_probs:
            continue

        consensus_home = sum(home_probs) / len(home_probs)
        consensus_away = sum(away_probs) / len(away_probs)

        for book_odd in game.odds:
            if not book_odd.home_price or not book_odd.away_price:
                continue

            home_implied = american_to_implied_prob(book_odd.home_price)
            away_implied = american_to_implied_prob(book_odd.away_price)

            home_ev = calculate_ev(book_odd.home_price, consensus_home)
            away_ev = calculate_ev(book_odd.away_price, consensus_away)

            results.append(EVResult(
                game_id=game.id,
                home_team=game.home_team,
                away_team=game.away_team,
                book=book_odd.book,
                side=game.home_team,
                price=book_odd.home_price,
                implied_prob=round(home_implied, 4),
                fair_prob=round(consensus_home, 4),
                ev_percent=round(home_ev * 100, 2),
            ))

            results.append(EVResult(
                game_id=game.id,
                home_team=game.home_team,
                away_team=game.away_team,
                book=book_odd.book,
                side=game.away_team,
                price=book_odd.away_price,
                implied_prob=round(away_implied, 4),
                fair_prob=round(consensus_away, 4),
                ev_percent=round(away_ev * 100, 2),
            ))

    return sorted(results, key=lambda x: x.ev_percent, reverse=True)
