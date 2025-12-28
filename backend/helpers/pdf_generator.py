from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER
from datetime import datetime
import io

class PDFGenerator:
    def __init__(self, title="FingerTrace Report"):
        self.title = title
        self.buffer = io.BytesIO()
        self.doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        self.styles = getSampleStyleSheet()
        self.story = []
        
        # Custom styles
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#333333'),
            spaceAfter=12,
        ))
    
    def add_title(self, title=None):
        """Add main title"""
        title_text = title or self.title
        title_para = Paragraph(title_text, self.styles['CustomTitle'])
        self.story.append(title_para)
        self.story.append(Spacer(1, 12))
    
    def add_metadata(self, metadata):
        """Add report metadata (date, workspace, etc.)"""
        meta_style = self.styles['Normal']
        for key, value in metadata.items():
            text = f"<b>{key}:</b> {value}"
            para = Paragraph(text, meta_style)
            self.story.append(para)
        self.story.append(Spacer(1, 20))
    
    def add_section(self, title):
        """Add section heading"""
        heading = Paragraph(title, self.styles['CustomHeading'])
        self.story.append(heading)
        self.story.append(Spacer(1, 12))
    
    def add_table(self, data, col_widths=None):
        """Add data table"""
        if not data or len(data) == 0:
            return
        
        # Create table
        table = Table(data, colWidths=col_widths)
        
        # Style table
        table.setStyle(TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4a5568')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            
            # Data rows
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ]))
        
        self.story.append(table)
        self.story.append(Spacer(1, 20))
    
    def add_paragraph(self, text):
        """Add paragraph text"""
        para = Paragraph(text, self.styles['Normal'])
        self.story.append(para)
        self.story.append(Spacer(1, 12))
    
    def generate(self):
        """Generate PDF and return bytes"""
        self.doc.build(self.story)
        pdf_bytes = self.buffer.getvalue()
        self.buffer.close()
        return pdf_bytes

def generate_fingerprints_pdf(fingerprints, workspace_name="Default"):
    """Generate PDF report for fingerprints"""
    pdf = PDFGenerator("Fingerprint Report")
    
    # Add title
    pdf.add_title("FingerTrace - Fingerprint Report")
    
    # Add metadata
    pdf.add_metadata({
        "Workspace": workspace_name,
        "Generated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Total Records": str(len(fingerprints))
    })
    
    # Add fingerprints table
    pdf.add_section("Fingerprint Data")
    
    if fingerprints:
        # Prepare table data
        headers = ["Fingerprint", "Device Type", "Platform", "Browser", "Created At"]
        rows = [headers]
        
        for fp in fingerprints[:100]:  # Limit to 100 for PDF
            rows.append([
                fp.get('fingerprint', '')[:20] + '...' if len(fp.get('fingerprint', '')) > 20 else fp.get('fingerprint', ''),
                fp.get('device_type', ''),
                fp.get('platform', ''),
                fp.get('browser', ''),
                fp.get('created_at', '')[:10] if fp.get('created_at') else ''
            ])
        
        pdf.add_table(rows, col_widths=[2*inch, 1*inch, 1*inch, 1*inch, 1.5*inch])
        
        if len(fingerprints) > 100:
            pdf.add_paragraph(f"Note: Showing first 100 of {len(fingerprints)} records")
    else:
        pdf.add_paragraph("No fingerprint data available")
    
    return pdf.generate()

def generate_analytics_pdf(analytics_data, workspace_name="Default"):
    """Generate PDF report for analytics"""
    pdf = PDFGenerator("Analytics Report")
    
    pdf.add_title("FingerTrace - Analytics Report")
    
    pdf.add_metadata({
        "Workspace": workspace_name,
        "Generated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Period": analytics_data.get('period', 'Last 7 days')
    })
    
    # Summary metrics
    pdf.add_section("Summary Metrics")
    
    metrics_data = [
        ["Metric", "Value"],
        ["Total Usage", str(analytics_data.get('usage', 0))],
        ["Unique Visitors", str(analytics_data.get('uniqueVisitors', 0))],
        ["Events per Visitor", str(analytics_data.get('eventsPerVisitor', 0))],
    ]
    
    pdf.add_table(metrics_data, col_widths=[3*inch, 2*inch])
    
    # Top browsers
    if analytics_data.get('topBrowsers'):
        pdf.add_section("Top Browsers")
        browser_data = [["Browser", "Count"]]
        for browser in analytics_data['topBrowsers'][:10]:
            browser_data.append([str(browser), "-"])
        pdf.add_table(browser_data, col_widths=[3*inch, 2*inch])
    
    # Top timezones
    if analytics_data.get('timezones'):
        pdf.add_section("Top Timezones")
        tz_data = [["Timezone", "Count"]]
        for tz in analytics_data['timezones'][:10]:
            tz_data.append([str(tz), "-"])
        pdf.add_table(tz_data, col_widths=[3*inch, 2*inch])
    
    return pdf.generate()
