import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { parseMarkdownBlocks, stripBold } from "@/lib/markdown-parser";
import { APP_NAME } from "@/config/constants";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  coverPage: {
    paddingHorizontal: 48,
    paddingTop: 120,
    fontFamily: "Helvetica",
  },
  logo: { width: 48, height: 48, marginBottom: 24, objectFit: "contain" },
  coverTitle: { fontSize: 26, fontWeight: 700, marginBottom: 8 },
  coverSubtitle: { fontSize: 13, color: "#64748b", marginBottom: 4 },
  coverDate: { fontSize: 10, color: "#94a3b8", marginTop: 40 },
  heading: { fontSize: 14, fontWeight: 700, marginTop: 18, marginBottom: 8 },
  paragraph: { fontSize: 10.5, lineHeight: 1.6, marginBottom: 8, color: "#1e293b" },
  listItem: { fontSize: 10.5, lineHeight: 1.6, marginBottom: 4, paddingLeft: 12, color: "#1e293b" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
  },
});

interface ReportPdfDocumentProps {
  readonly markdown: string;
  readonly title: string;
  readonly periodLabel: string;
  readonly brandColor: string;
  readonly logoDataUrl: string | null;
  readonly generatedAt: string;
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>{APP_NAME}</Text>
      <Text render={({ pageNumber, totalPages }) => `Trang ${pageNumber} / ${totalPages}`} fixed />
    </View>
  );
}

export function ReportPdfDocument({
  markdown,
  title,
  periodLabel,
  brandColor,
  logoDataUrl,
  generatedAt,
}: ReportPdfDocumentProps) {
  const blocks = parseMarkdownBlocks(markdown);

  return (
    <Document title={title} author={APP_NAME} creator={APP_NAME}>
      {/* Cover page */}
      <Page size="A4" style={styles.coverPage}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img */}
        {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
        <Text style={[styles.coverTitle, { color: brandColor }]}>{title}</Text>
        <Text style={styles.coverSubtitle}>Kỳ báo cáo: {periodLabel}</Text>
        <Text style={styles.coverDate}>
          Tạo lúc {new Date(generatedAt).toLocaleString("vi-VN")}
        </Text>
        <Footer />
      </Page>

      {/* Content page(s) */}
      <Page size="A4" style={styles.page}>
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            return (
              <Text key={index} style={[styles.heading, { color: brandColor }]}>
                {block.text}
              </Text>
            );
          }
          if (block.type === "list") {
            return (
              <View key={index}>
                {block.items.map((item, i) => (
                  <Text key={i} style={styles.listItem}>
                    • {stripBold(item)}
                  </Text>
                ))}
              </View>
            );
          }
          return (
            <Text key={index} style={styles.paragraph}>
              {stripBold(block.text)}
            </Text>
          );
        })}
        <Footer />
      </Page>
    </Document>
  );
}
