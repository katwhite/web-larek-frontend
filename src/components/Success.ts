import {Component} from "./base/Component";
import {ensureElement} from "./../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {

    protected total: HTMLElement;
    protected close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this.total = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.close = ensureElement<HTMLElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            this.close.addEventListener('click', actions.onClick);
        }
    }

    setTotal(total: number) {
        this.setText(this.total, `Списано ${total} синапсов`)
    }
}