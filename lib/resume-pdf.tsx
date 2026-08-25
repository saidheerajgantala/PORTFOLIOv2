import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { CAREER } from '@/content/career';

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: 'Helvetica', fontSize: 10, color: '#0A0A0B' },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  subhead: { fontSize: 11, color: '#555555', marginBottom: 14 },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  stopTitle: { fontFamily: 'Helvetica-Bold' },
  stop: { marginBottom: 6 },
  period: { color: '#666666' },
  bullet: { marginLeft: 8, marginTop: 1, lineHeight: 1.4 },
});

const STACK =
  'LangGraph, Temporal, LangSmith, Python, Postgres, AWS (EKS), GCP (Cloud Run, Dataflow), Azure (AKS, Entra ID)';

const [current] = CAREER;

function Resume() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>Sai Dheeraj Gantala</Text>
        <Text style={styles.subhead}>
          {current.title} · {current.company}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {CAREER.map((stop) => (
            <View key={stop.id} style={styles.stop}>
              <View style={styles.row}>
                <Text style={styles.stopTitle}>
                  {stop.title} · {stop.company}
                </Text>
                <Text style={styles.period}>{stop.period}</Text>
              </View>
              <View>
                {stop.achievements.map((a) => (
                  <Text key={a} style={styles.bullet}>
                    • {a}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stack</Text>
          <Text>{STACK}</Text>
        </View>
      </Page>
    </Document>
  );
}

// Returns an ArrayBuffer-backed view rather than a Node Buffer: `Buffer` is typed as
// `ArrayBufferView<ArrayBufferLike>` and so is not assignable to the DOM `BodyInit`
// that Response/NextResponse expects.
export async function renderResume(): Promise<Uint8Array<ArrayBuffer>> {
  const buffer = await renderToBuffer(<Resume />);
  return new Uint8Array(buffer);
}
