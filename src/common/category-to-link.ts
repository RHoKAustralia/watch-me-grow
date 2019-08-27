export type LinkData = { introKey: string; url: string };
const categoryToLink: { [key: string]: LinkData[] } = {
  development: [
    {
      introKey: "results.linkIntros.raisingChildren",
      url: "https://raisingchildren.net.au"
    }
  ],
  behaviour: [
    {
      introKey: "results.linkIntros.raisingChildren",
      url: "https://raisingchildren.net.au"
    },
    {
      introKey: "results.linkIntros.parentWorks",
      url: "https://parentworks.org.au"
    }
  ],
  emotions: [
    {
      introKey: "results.linkIntros.beyondBlue",
      url: "https://healthyfamilies.beyondblue.org.au/pregnancy-and-new-parents"
    }
  ]
};
export default categoryToLink;
