import { Injectable, Inject, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common'


@Injectable({
    providedIn: 'root'
})
export class SEOService {

    constructor(private rendererFactory: RendererFactory2, private title: Title, private meta: Meta, @Inject(DOCUMENT) private document, ) { }

    updateTitle(title: string) {
        this.title.setTitle(title);
    }

    updateDescription(desc: string) {
        this.meta.updateTag({ name: 'description', content: desc })
    }

    updateOgUrl(url: string) {
        this.meta.updateTag({ property: 'og:url', content: url })
    }

    updateOGLang(lang) {
        this.meta.updateTag({ property: 'og:language', content: lang })
    }

    addLink(tag: LinkDefinition, forceCreation?: boolean) {


        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const link = renderer.createElement('link');
            const head = this.document.head;
            const selector = this._parseSelector(tag);

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            Object.keys(tag).forEach((prop: string) => {
                return renderer.setAttribute(link, prop, tag[prop]);
            });

            // [TODO]: get them to update the existing one (if it exists) ?
            const children = head.children;
            for (var idx = 0; idx < children.length; idx++) {
                if (children[idx].localName === 'link' && children[idx].rel === tag.rel)
                    if (tag.hreflang) { if (children[idx].hreflang === tag.hreflang) { renderer.removeChild(head, children[idx]); } }
                    else
                        renderer.removeChild(head, children[idx]);
            }

            renderer.appendChild(head, link);

        } catch (e) {
            console.error('Error within linkService : ', e);
        }

    }

    addLanguageLink(tag: LinkDefinition, forceCreation?: boolean) {

        //how to use 
        //make sure also you have in index page 
        // <link rel="prefetch" href="/arstyle.css" as="style" async>
        // <link rel="prefetch" href="/enstyle.css" as="style" async>
        
        //addStyle(isarabic = false) {
        // if (isarabic)
        // this.seo.addLanguageLink({ rel: 'stylesheet', href: '/arstyle.css', Id: 'lang' });
        // else
        // this.seo.addLanguageLink({ rel: 'stylesheet', href: '/enstyle.css', Id: 'lang' });
        // }

        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const link = renderer.createElement('link');
            const head = this.document.head;
            const selector = this._parseSelector(tag);

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            const lang = this.document.getElementById('lang');
            if (lang != null) {
                if (lang.href.includes(tag.href.replace('/', ''))) {
                    return;
                } else {
                }
            }


            Object.keys(tag).forEach((prop: string) => {
                return renderer.setAttribute(link, prop, tag[prop]);
            });


            // [TODO]: get them to update the existing one (if it exists) ?
            const children = head.children;
            for (var idx = 0; idx < children.length; idx++) {
                if (children[idx].localName === 'link' && children[idx].rel === tag.rel)
                    if (tag.hreflang) { if (children[idx].hreflang === tag.hreflang) { renderer.removeChild(head, children[idx]); } }
                    else
                        renderer.removeChild(head, children[idx]);
            }

            renderer.appendChild(head, link);


        } catch (e) {
            console.error('Error within linkService : ', e);
        }

    }

    private _parseSelector(tag: LinkDefinition): string {
        // Possibly re-work this
        const attr: string = tag.rel ? 'rel' : 'hreflang';
        return `${attr}="${tag[attr]}"`;
    }

}

export declare type LinkDefinition = {
    charset?: string;
    crossorigin?: string;
    href?: string;
    hreflang?: string;
    media?: string;
    rel?: string;
    rev?: string;
    sizes?: string;
    target?: string;
    type?: string;
    Id?: string;
} & {
    [prop: string]: string;
};
