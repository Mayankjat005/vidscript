import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose prose-neutral max-w-none space-y-8">
              <section>
                <p className="text-muted-foreground text-lg mb-8">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using VidScript, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  VidScript provides an AI-powered video-to-text transcription service. Users can upload 
                  video files and receive text transcriptions of the audio content. The service supports 
                  multiple video formats and languages.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">3. User Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for ensuring you have the necessary rights to upload and transcribe 
                  any video content. You must not upload content that is illegal, infringing, defamatory, 
                  or violates any third-party rights.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">4. Usage Limits</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Maximum file size: 500MB per upload</li>
                  <li>Maximum video duration: 60 minutes</li>
                  <li>Rate limiting may be applied to prevent abuse</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You retain all rights to your uploaded content and the resulting transcriptions. 
                  VidScript does not claim ownership of any content you upload or create using our service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">6. Accuracy Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive for high accuracy, AI-generated transcriptions may contain errors. 
                  We recommend reviewing all transcriptions before use, especially for professional or 
                  legal purposes. VidScript is not responsible for any inaccuracies in transcriptions.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  VidScript is provided "as is" without warranties of any kind. We shall not be liable 
                  for any indirect, incidental, special, consequential, or punitive damages resulting 
                  from your use of the service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">8. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to terminate or suspend access to our service at any time, 
                  without prior notice, for violations of these terms or for any other reason.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">9. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may modify these terms at any time. Continued use of the service after changes 
                  constitutes acceptance of the modified terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us at legal@vidscript.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
