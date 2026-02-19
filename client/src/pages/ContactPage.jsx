import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Container, Input, Button } from '@/components/common';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted');
  };

  return (
    <Container className="py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-2">
          Contact Us
        </h1>
        <p className="text-dark-600 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-dark-900 mb-6">Get in Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-900 mb-1">Email</h4>
                  <p className="text-dark-600">support@virtualtourist.com</p>
                  <p className="text-dark-600">info@virtualtourist.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-900 mb-1">Phone</h4>
                  <p className="text-dark-600">+1 (555) 123-4567</p>
                  <p className="text-dark-600">Mon-Fri 9am-6pm PST</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-900 mb-1">Office</h4>
                  <p className="text-dark-600">123 Virtual Street</p>
                  <p className="text-dark-600">San Francisco, CA 94102</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="bg-primary-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-dark-900 mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-dark-600 mb-4">
              Find quick answers to common questions in our FAQ section.
            </p>
            <Button variant="outline">View FAQ</Button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-dark-900 mb-6">Send us a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                required
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />

            <Input
              label="Subject"
              name="subject"
              placeholder="How can we help?"
              required
            />

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Tell us more about your inquiry..."
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" size="lg">
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
