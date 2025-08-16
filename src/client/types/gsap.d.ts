declare module 'gsap' {
  interface IGSAPTweenVars {
    [key: string]: any;
  }

  interface IGSAP {
    to: (target: any, vars: IGSAPTweenVars) => any;
    from: (target: any, vars: IGSAPTweenVars) => any;
    set: (target: any, vars: IGSAPTweenVars) => any;
  }

  const gsap: IGSAP;
  export default gsap;
}