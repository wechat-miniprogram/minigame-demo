import { Layout, Element } from './engine';
interface JsonNode {
    index: string;
    node: string;
    parent?: JsonNode;
    tag?: string;
    tagType?: string;
    nodes?: JsonNode[];
    styleStr?: string;
    styleObj?: Record<string, any>;
    text?: string;
}
interface IDC {
    filleStyle: string | null;
    fontStyle: string | null;
    fontWeight: string | null;
    fontSize: number | null;
    textAlign: CanvasTextAlign | null;
    text: string;
    x: number;
    y: number;
}
/**
 * @description 获取字符宽度
 * @param char
 * @param fontSize
 */
export declare const getCharWidth: (char: string, fontSize: number) => number;
type RichTextOptions = {
    style?: object;
    idName?: string;
    className?: string;
    dataset: Record<string, any>;
};
export declare class RichText extends Element {
    private innerText;
    private jsonData;
    private dcs;
    fontSize?: number;
    textBaseline: CanvasTextBaseline;
    font: string;
    textAlign: CanvasTextAlign;
    fillStyle: string;
    constructor(opts: RichTextOptions);
    set text(value: string);
    get text(): string;
    setStyleForDc(currDc: IDC, styleObj: Record<string, any>): void;
    buildDrawCallFromJsonData(jsonData: JsonNode): void;
    repaint(): void;
    destroySelf(): void;
    insert(ctx: CanvasRenderingContext2D, needRender: boolean): void;
    toCanvasData(): void;
    render(): void;
}
declare function install(layout: Layout): typeof RichText;
declare const _default: {
    install: typeof install;
    name: string;
};
export default _default;
