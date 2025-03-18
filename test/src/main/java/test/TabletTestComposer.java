package test;

import org.zkoss.zk.ui.*;
import org.zkoss.zk.ui.metainfo.ComponentInfo;
import org.zkoss.zk.ui.select.SelectorComposer;
import org.zkoss.zk.ui.sys.PageCtrl;

public class TabletTestComposer extends SelectorComposer {
    /** to override navigator before zk reads it, we need to add the script tag before all zk generated script tags
     * */
    @Override
    public ComponentInfo doBeforeCompose(Page page, Component parent, ComponentInfo compInfo) {
        ((PageCtrl)page).addBeforeHeadTags("<script type=\"text/javascript\" src=\"/test/maxtouchpoints.js\" charset=\"UTF-8\"></script>");
        return super.doBeforeCompose(page, parent, compInfo);
    }
}
