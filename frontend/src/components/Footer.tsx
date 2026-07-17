export default function Footer() {
  return (
    <footer className="border-t border-gold/20 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-ivory/60">
        <div>
          <h4 className="font-display text-lg text-ivory mb-3">Ceylon Gem Atelier</h4>
          <p>Ethically sourced, certified Ceylon gemstones, connected directly to collectors worldwide.</p>
        </div>
        <div>
          <h5 className="text-ivory mb-3 uppercase tracking-wide text-xs">Shop</h5>
          <ul className="space-y-2">
            <li>Blue Sapphire</li>
            <li>Pink Sapphire</li>
            <li>Ruby</li>
            <li>Padparadscha</li>
          </ul>
        </div>
        <div>
          <h5 className="text-ivory mb-3 uppercase tracking-wide text-xs">Trust</h5>
          <ul className="space-y-2">
            <li>Certification &amp; Authenticity</li>
            <li>Secure Payments</li>
            <li>Insured Worldwide Shipping</li>
          </ul>
        </div>
        <div>
          <h5 className="text-ivory mb-3 uppercase tracking-wide text-xs">Contact</h5>
          <p>Beruwala, Sri Lanka</p>
          <p>+94 740 544 443</p>
        </div>
      </div>
      <div className="facet-divider" />
      <p className="text-center text-xs text-ivory/40 py-6">© {new Date().getFullYear()} Ceylon Gem Atelier. All rights reserved.</p>
    </footer>
  )
}
