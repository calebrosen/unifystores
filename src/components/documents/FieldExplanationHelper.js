import Swal from "sweetalert2";

export function explainLevel(level) {
  const infoMap = {
    top: {
      title: "What should the top level be?",
      html: "This should be something like Grills, Accessories, Parts, Linear Fireplaces, or Patio Heaters.",
    },
    second: {
      title: "What should the second level be?",
      html: "If the top level is Grills or Fireplaces, this would normally be the series. Otherwise, this is typically the type of product. Such as type of accessory or part.",
    },
    third: {
      title: "What should the third level be?",
      html: "This level and levels below may not even be needed. Only put stuff and below here if you can break the product down further.",
    },
    fourth: {
      title: "What should the fourth level be?",
      html: "We should be further breaking the product down by size or type/configuration here.",
    },
    fifth: {
      title: "What should the fifth level be?",
      html: "Typically you should not reach this level unless the product has some sort of configuration.",
    },
    sixth: {
      title: "What should the sixth level be?",
      html: "You will be at a minimum of 7 clicks to get to the manual. Simplify unless absolutely necessary.",
    },
    productDisplayName: {
      title: "What should the product display name be?",
      html: "This is the display name of the product - typically the model number or what the product is, like 'E660', or 'Charred Oak'.",
    },
    documentType: {
      title: "What should the document type be?",
      html: "Abbreviation of document type. Use lowercase and snake case. Examples:<br>om: Owner's Manual<br>ss: Overview<br>cad: Cad Drawing<br>app: App<br>wiring: Wiring Diagram",
    },
    year: {
      title: "What should the year be?",
      html: "Year the document was released. If unknown, use something like 'Pre 2004'.",
    },
    path: {
      title: "How do I get the path?",
      html: "Upload the document and copy the file path provided. Make sure everything is snake case.",
    },
    mpn: {
      title: "What do I put for MPN's?",
      html: "Comma-delimited list of MPNs this document applies to. Example: E660i-9EAN,E660i-9E1N",
    },
  };

  if (infoMap[level]) {
    Swal.fire({
      title: infoMap[level].title,
      html: infoMap[level].html,
      icon: "question",
      customClass: "sweetalert-lg-info bg-slate-600 text-neutral-200",
    });
  }
}