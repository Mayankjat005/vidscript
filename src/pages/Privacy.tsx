import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose prose-neutral max-w-none space-y-8">
              <section>
                <p className="text-muted-foreground text-lg mb-8">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you use VidScript, we temporarily process video files you upload for transcription purposes. 
                  This includes the video content, audio tracks, and any metadata contained within the file.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your uploaded videos are used solely for the purpose of generating text transcriptions. 
                  We do not use your content for training AI models, marketing purposes, or share it with third parties.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">3. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All uploaded video files are automatically deleted from our servers immediately after 
                  transcription is complete. We do not retain copies of your original video files. 
                  Transcription results are stored temporarily for your session only.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your data during transmission 
                  and processing. All file uploads are encrypted using TLS/SSL protocols. Our servers are 
                  secured with enterprise-grade protection.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">5. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to access, correct, or delete any personal information we hold about you. 
                  Since we don't store your video files or transcriptions permanently, most data is 
                  automatically deleted after your session ends.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">6. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use essential cookies to ensure the proper functioning of our service. 
                  These cookies do not track your personal information or browsing behavior across other websites.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">7. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@vidscript.com.
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

export default Privacy;
