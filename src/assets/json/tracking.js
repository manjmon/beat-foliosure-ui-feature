let Pixel_Code_script = document.createElement("script");
Pixel_Code_script.setAttribute("defer", "defer");
switch (window.location.hostname) {
  case "taabo-ch.beatfoliosure.com":
    Pixel_Code_script.setAttribute(
      "src",
      "https://analytics.beat-services.net/pixel/2B1ZAKrPFei7zaUQ"
    );
    document.head.appendChild(Pixel_Code_script);
    break;
  case "larissa.beatfoliosure.com":
    Pixel_Code_script.setAttribute(
      "src",
      "https://analytics.beat-services.net/pixel/jq0lsteGiuQU34Vo"
    );
    document.head.appendChild(Pixel_Code_script);
    break;
  case "monmouth.beatfoliosure.com":
    Pixel_Code_script.setAttribute(
      "src",
      "https://analytics.beat-services.net/pixel/f7D2izu5pp8ZJeXa"
    );
    document.head.appendChild(Pixel_Code_script);
    break;
  case "demo.beatfoliosure.com":
    Pixel_Code_script.setAttribute(
      "src",
      "https://analytics.beat-services.net/pixel/mSj9OqjG5CqpK66H"
    );
    document.head.appendChild(Pixel_Code_script);
    break;
  default:
}