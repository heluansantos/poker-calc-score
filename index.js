const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.get("/calculate-score", (req, res) => {
  const playerHands = req.query.playerHands.split(",");
  const deck = req.query.deck.split(",");

  function calc(playerHands, deck) {
    const handCards = [...playerHands, ...deck];
    const DECK = [
      "SPADE-2",
      "SPADE-3",
      "SPADE-4",
      "SPADE-5",
      "SPADE-6",
      "SPADE-7",
      "SPADE-8",
      "SPADE-9",
      "SPADE-10",
      "SPADE-J",
      "SPADE-Q",
      "SPADE-K",
      "SPADE-A",
      "HEART-2",
      "HEART-3",
      "HEART-4",
      "HEART-5",
      "HEART-6",
      "HEART-7",
      "HEART-8",
      "HEART-9",
      "HEART-10",
      "HEART-J",
      "HEART-Q",
      "HEART-K",
      "HEART-A",
      "CLUB-2",
      "CLUB-3",
      "CLUB-4",
      "CLUB-5",
      "CLUB-6",
      "CLUB-7",
      "CLUB-8",
      "CLUB-9",
      "CLUB-10",
      "CLUB-J",
      "CLUB-Q",
      "CLUB-K",
      "CLUB-A",
      "DIAMOND-2",
      "DIAMOND-3",
      "DIAMOND-4",
      "DIAMOND-5",
      "DIAMOND-6",
      "DIAMOND-7",
      "DIAMOND-8",
      "DIAMOND-9",
      "DIAMOND-10",
      "DIAMOND-J",
      "DIAMOND-Q",
      "DIAMOND-K",
      "DIAMOND-A",
    ];

    const getCardInfo = (card) => {
      const [suit, rank] = card.split("-");
      return { suit, rank };
    };

    const sortCardsByRank = (cards) => {
      return cards.sort((a, b) => {
        const rankA = DECK.indexOf(getCardInfo(a).rank);
        const rankB = DECK.indexOf(getCardInfo(b).rank);
        return rankA - rankB;
      });
    };

    const rankCounts = {};
    const suitCounts = {};
    handCards.forEach((card) => {
      const { suit, rank } = getCardInfo(card);
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
      suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    });

    const isFlush = Object.values(suitCounts).includes(5);

    const sortedCards = sortCardsByRank(handCards);

    let score = 0;
    if (Object.values(rankCounts).includes(4)) {
      // Four of a Kind
      score = 100;
    } else if (
      Object.values(rankCounts).includes(3) &&
      Object.values(rankCounts).includes(2)
    ) {
      // Full House
      score = 90;
    } else if (isFlush) {
      // Flush
      score = 80;
    } else if (Object.values(rankCounts).includes(3)) {
      // Three of a Kind
      score = 70;
    } else if (
      Object.values(rankCounts).filter((count) => count === 2).length === 2
    ) {
      // Two Pair
      score = 60;
    } else if (
      Object.values(rankCounts).filter((count) => count === 2).length === 1
    ) {
      // One Pair
      score = 50;
    }

    let isStraight = true;
    for (let i = 0; i < sortedCards.length - 1; i++) {
      const currentRankIndex = DECK.indexOf(getCardInfo(sortedCards[i]).rank);
      const nextRankIndex = DECK.indexOf(getCardInfo(sortedCards[i + 1]).rank);
      if (nextRankIndex !== currentRankIndex + 1) {
        isStraight = false;
        break;
      }
    }

    if (isStraight) {
      // Straight
      score = 40;
    }

    if (isFlush && isStraight) {
      // Straight Flush
      score = 120;
    }

    if (Object.values(rankCounts).includes(8)) {
      // Four of a Kind (Quadra) of rank 8
      score = 110;
    }

    const minScore = 0;
    const maxScore = 100;

    const mappedScore = ((score - minScore) / (maxScore - minScore)) * 100;

    return Math.round(mappedScore);
  }

  const score = calc(playerHands, deck);
  res.json({ score });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
