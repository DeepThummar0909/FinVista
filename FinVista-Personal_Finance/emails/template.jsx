import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  const currency = (amount) => `$${amount.toLocaleString()}`;

  if (type === "monthly-report") {
    const net = data?.stats.totalIncome - data?.stats.totalExpenses;
    return (
      <Html>
        <Head />
        <Preview>🚀 Your Smart Monthly Finance Snapshot is Ready!</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>📊 Smart Finance Report</Heading>
            <Text style={styles.subtext}>Hi {userName}, here’s your financial summary for <strong>{data?.month}</strong>.</Text>

            {/* Overview Stats */}
            <Section style={styles.statsSection}>
              {[
                { label: "💰 Total Income", value: currency(data?.stats.totalIncome) },
                { label: "💸 Total Expenses", value: currency(data?.stats.totalExpenses) },
                {
                  label: net >= 0 ? "📈 Net Savings" : "📉 Net Deficit",
                  value: currency(net),
                },
              ].map(({ label, value }) => (
                <div style={styles.statCard} key={label}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <Text style={styles.statValue}>{value}</Text>
                </div>
              ))}
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.sectionTitle}>📂 Expense Breakdown</Heading>
                {Object.entries(data.stats.byCategory).map(([category, amount]) => (
                  <div key={category} style={styles.row}>
                    <Text style={styles.rowLabel}>{category}</Text>
                    <Text style={styles.rowValue}>{currency(amount)}</Text>
                  </div>
                ))}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights?.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.sectionTitle}>🤖 Welth AI Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.insightItem}>
                    🔹 {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Stay smart with Welth — Your AI-powered financial assistant 🧠💼
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    const remaining = data?.budgetAmount - data?.totalExpenses;
    return (
      <Html>
        <Head />
        <Preview>⚠️ Budget Warning — {data.percentageUsed}% Used</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>⚠️ Budget Alert</Heading>
            <Text style={styles.subtext}>Hey {userName},</Text>
            <Text style={styles.subtext}>
              You've used <strong>{data.percentageUsed.toFixed(1)}%</strong> of your budget this month.
            </Text>

            {/* Budget Stats */}
            <Section style={styles.statsSection}>
              {[
                { label: "🎯 Budget", value: currency(data.budgetAmount) },
                { label: "💳 Spent", value: currency(data.totalExpenses) },
                { label: "🟢 Remaining", value: currency(remaining) },
              ].map(({ label, value }) => (
                <div style={styles.statCard} key={label}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <Text style={styles.statValue}>{value}</Text>
                </div>
              ))}
            </Section>

            {/* Progress Bar */}
            <div style={styles.progressBarWrapper}>
              <div style={{ ...styles.progressBar, width: `${data.percentageUsed}%` }} />
            </div>

            <Text style={styles.footer}>
              Tip: Review high-spending categories to stay within limits 🔍
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#0f172a",
    fontFamily: "system-ui, sans-serif",
    color: "#f8fafc",
    padding: "40px 0",
  },
  container: {
    backgroundColor: "#1e293b",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "28px",
    textAlign: "center",
    color: "#38bdf8",
    marginBottom: "16px",
  },
  subtext: {
    fontSize: "16px",
    marginBottom: "16px",
    color: "#cbd5e1",
  },
  section: {
    marginTop: "28px",
    padding: "16px",
    backgroundColor: "#334155",
    borderRadius: "10px",
  },
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "12px",
    color: "#f1f5f9",
  },
  statsSection: {
    margin: "24px 0",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },
  statCard: {
    backgroundColor: "#475569",
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
  },
  statLabel: {
    color: "#cbd5e1",
    fontSize: "14px",
  },
  statValue: {
    color: "#f1f5f9",
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "4px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #64748b",
  },
  rowLabel: {
    fontSize: "14px",
    color: "#e2e8f0",
  },
  rowValue: {
    fontSize: "14px",
    color: "#f8fafc",
  },
  insightItem: {
    fontSize: "15px",
    color: "#e0f2fe",
    marginBottom: "10px",
  },
  progressBarWrapper: {
    height: "12px",
    backgroundColor: "#334155",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "24px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#22d3ee",
    transition: "width 0.4s ease-in-out",
  },
  footer: {
    fontSize: "13px",
    textAlign: "center",
    color: "#94a3b8",
    marginTop: "28px",
  },
};
