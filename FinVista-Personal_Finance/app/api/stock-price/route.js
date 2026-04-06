import yahooFinance from 'yahoo-finance2';

export async function POST(req) {
  const { symbols } = await req.json();
  if (!symbols || !Array.isArray(symbols)) {
    return new Response(JSON.stringify({ error: "Missing symbols" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prices = {};
  for (const symbol of symbols) {
    try {
      const ticker = symbol.toUpperCase().endsWith(".NS") ? symbol : `${symbol.toUpperCase()}.NS`;
      const quote = await yahooFinance.quote(ticker);
      prices[symbol] = quote.regularMarketPrice;
    } catch (err) {
      prices[symbol] = null;
    }
  }

  return new Response(JSON.stringify({ prices }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}