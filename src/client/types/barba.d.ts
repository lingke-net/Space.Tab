declare module '@barba/core' {
  interface IBarbaOptions {
    debug?: boolean;
    transitions?: Array<{
      name?: string;
      sync?: boolean;
      from?: { namespace?: string[] };
      to?: { namespace?: string[] };
      leave?: (data: any) => Promise<any> | any;
      enter?: (data: any) => Promise<any> | any;
      after?: (data: any) => void;
    }>;
    views?: Array<{
      namespace?: string;
      beforeEnter?: () => void;
    }>;
  }

  interface IBarbaHooks {
    before: (callback: () => void) => void;
    after: (callback: () => void) => void;
  }

  interface IBarba {
    init: (options: IBarbaOptions) => void;
    destroy: () => void;
    hooks: IBarbaHooks;
  }

  const barba: IBarba;
  export default barba;
}

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