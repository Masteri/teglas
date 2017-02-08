function on_product_selected(n){
    id_product=$(n).val();
    get_components()
}
function show_product_unit(){
    var n=$("select.product").closest(".form-group").next().find("span.unit"),
        t=$("select.product").find("option[value="+id_product+"]").attr("data-unit");
    $(n).html(t)}function show_product_min_qnty(){$(".total").removeClass("hidden");
    $(".qnty_unknown input[type=checkbox]").removeAttr("checked");
    var n=$("select.product").find("option[value="+id_product+"]").attr("data-min-qnty");
    $("input[type=text].product_qnty").removeAttr("disabled").val(n).removeAttr("aria-invalid").removeClass("input-validation-error").rules("add",{range:[n,1e6],
        messages:{range:"Please enter numbers in range"}});
    $("input[type=text].product_qnty").closest("div").find(".minqnty b").html(n)
    }

    function show_hide_allow0qnty(){
        var n=$("select.product").find("option[value="+id_product+"]").attr("data-allow0qnty")==="true";
        n?$(".qnty_unknown").removeClass("hidden"):$(".qnty_unknown").addClass("hidden")
    }

    function get_components(){
        showprogress();$.ajax({type:"POST",url:"/admin/service/getcomponents",contentType:"application/json; charset=utf-8",
            data:JSON.stringify({id_product:id_product}),
            dataType:"json",success:function(n){if(hideprogress(),n.result!=0){alert(n.message);
                return}build_components(n.ctypes)}})
    }

    function get_filerequirments(){
        showprogress();
        $.ajax({type:"POST",url:"/admin/service/getfilerequirments",
            contentType:"application/json; charset=utf-8",
            data:JSON.stringify({id_product:id_product}),dataType:"json",
            success:function(n){
            if(hideprogress(),n.result!=0){alert(n.message);
                return }$(".filerequirments").html(n.html)}})
    }

    function build_components(n){
        var h,t,e,r,f,i,c,o,u,l,a,s;
        for(get_filerequirments(),
                show_product_unit(),
                show_hide_allow0qnty(),
                h=$(".component_types"),
                $(".components:not(.hidden)").remove(),t=0;t<n.length;t++)
            if(e=$(".components.hidden").clone().removeClass("hidden"),
                    $(e).find("label").html(n[t].name),
                    n[t].ismultiselect)for(i in n[t].components){r=$("<input/>");
                $(r).attr("class","with-font chk_component");$(r).attr("id","chk_"+i+n[t].components[i].id_component);
                $(r).attr("data-id-component",n[t].components[i].id_component);
                $(r).attr("type","checkbox");
                $(r).on("click",calculate_total);$(div).append(r);u=$("<label/>");
                $(u).attr("for","chk_"+i+n[t].components[i].id_component);
                $(u).html(n[t].components[i].name);
                $(div).append($("<div/>").append(r).append(u));
                $(h).append(div)}else{f=$('<select class="form-control"/>');
                $(f).on("change",function(){update_component_qnty_data_id(this)});
                for(i in n[t].components)c=$("<option/>"),
                    $(c).attr("value",n[t].components[i].id_component).attr("data-askqnty",n[t].components[i].askqnty).attr("data-unit",n[t].components[i].unit).attr("data-multiplier",
                        n[t].components[i].multiplier).html(n[t].components[i].name),
                    f.append(c);
                $(e).append(f);
                o=$("<div/>");
                u=$("<label class='inline-block'/>");
                u.html(txt_qnty);
                $(o).append(u);
                l=$("<span class='unit' />");
                $(l).html(", "+n[t].components[i].unit);$(u).append(l);a=$("<input type='text'/>");
                $(a).attr("data-id-component",n[t].components[i].id_component).attr("class","form-control component_qnty").attr("name","component_qnty").attr("id","component_qnty").attr("data-val","true").attr("data-val-required","required").val("0").on("blur",calculate_total);
                $(o).append(a);
                s=$("div.qnty_unknown_component.hidden").clone().removeClass("hidden");
                $(s).find("label").attr("for","uqnty_ctype_"+t);
                $(s).find("input[type=checkbox]").attr("id","uqnty_ctype_"+t);
                $(o).append(s);
                $(e).append(o);
                $(h).append(e);
                update_component_qnty_data_id(f)
                }
                update_component_qnty_data_id(f);
        show_product_min_qnty();
        $.validator.unobtrusive.parse($("form"));
        $(".component_qnty").rules("add",{required:!0,range:[0,1e6],messages:{required:"Required field",range:"Please enter a number"}});
        calculate_total()}

        function update_component_qnty_data_id(n){
            var t=$(n).val(),e=$("option:selected",n).attr("data-multiplier"),i=$(n).closest("div.components").find("input[type=text]"),u,r,f;$(i).attr("data-id-component",t).attr("data-multiplier",e);
            u=$(n).find("option[value="+t+"]").attr("data-unit");
            $(i).closest("div").find("span.unit").html(", "+u);
            r=$(n).closest("div.components").find("input[type=checkbox]");
            $(r).attr("id","chk_"+t);
            $(r).on("click",function(){unknown_component_qnty_click(this)});
            $(n).closest("div.components").find("label").attr("for","chk_"+t);
            f=$(n).find("option[value="+t+"]").attr("data-askqnty")==="true";
            f?$(i).closest("div").removeClass("hidden"):$(i).closest("div").addClass("hidden");
            calculate_total()
        }

        function unknown_product_qnty_click(n){
            var t=$(n).is(":checked");
            t?($("input[type=text].product_qnty").val("0").attr("disabled","disabled").removeAttr("data-val").removeAttr("aria-invalid").removeClass("input-validation-error"),
                $(".total").addClass("hidden")):(show_product_min_qnty(),
                calculate_total())
        }

        function unknown_component_qnty_click(n){
            var i=$(n).is(":checked"),
                t=$(n).closest(".components").find("input[type=text].component_qnty").removeAttr("data-val").removeAttr("aria-invalid").removeClass("input-validation-error");
            i?$(t).val("0").attr("disabled","disabled"):$(t).val("0").removeAttr("disabled");
            calculate_total()
        }

        function calculate_total(){
            $("form").valid()&&product_qnty!==0&&$.ajax({
                type:"POST",
                url:"/service/calculate",
                contentType:"application/json; charset=utf-8",
                data:JSON.stringify(getorder_fromform()),
                dataType:"json",
                success:
                    function(n){
                    if(hideprogress(),
                        n.result!=0){
                        alert(n.message);
                        return}
                        $(".total b").html(parseFloat(n.total).toFixed(2))}})
        }

        function getorder_fromform(){
            var n=[];
            return $(".components input.component_qnty").each(function(){
                n.push({id_component:
                    $(this).attr("data-id-component"),
                    multiplier:$(this).attr("data-multiplier"),
                    qnty:$(this).closest("div").hasClass("hidden")?$(".product_qnty").val():$(this).val()})
            })
                ,$("input[type=checkbox].chk_component:checked").each(function(){
                    n.push({
                        id_component:$(this).attr("data-id-component"),
                        qnty:$(".product_qnty").val()})}),
            {name:$("input.ordername").val(),
                id_product:id_product,product_qnty:$(".product_qnty").val(),
                components:n,needs_calculation:$(".qnty_unknown_component input[type=checkbox]:checked").length>0||$("#chk_product_qnty:checked").length>0,
                comments:$(".ordercomments").val(),
                files:get_uploaded_fileinfo(),
                deliveryaddress:$(".deliveryaddress").val(),
                id_payment_type:$("input[type=radio][name=pt]:checked").val()}
        }


        function save_order(){
            $("button.saveorder").addClass("hidden");
            showprogress();
            $.ajax({
                type:"POST",
                url:"/order/save",
                contentType:"application/json; charset=utf-8",
                data:JSON.stringify(getorder_fromform()),
                dataType:"json",
                success:function(n){
                    if(n.result!=0){alert(n.message);
                        return
                    }
                    document.location.href=n.href}})
        }

        function initplupload(){
            var n=new plupload.Uploader({
                runtimes:"html5,flash,silverlight,html4",
                browse_button:"pickfiles",
                container:$(".uploadbuttons").element,
                url:"https://plsfiles.s3.amazonaws.com:443/",
                flash_swf_url:"/Script/plupload/js/Moxie.swf",
                silverlight_xap_url:"/Script/plupload/js/Moxie.xap",
                multiple_queues:!0,multipart:!0,multipart_params:{
                    key:"",
                    Filename:"${filename}",
                    acl:"private","Content-Type":"",
                    AWSAccessKeyId:AWS_ID,
                    policy:PolicyDocument,
                    signature:PolicySignature},
                filters:{
                        max_file_size:max_file_size,
                    max_files:10,
                    mime_types:[{title:"PDF",
                        extensions:"pdf"},
                        {title:"CDR",extensions:"cdr"},
                        {title:"PSD",extensions:"psd"},
                        {title:"JPG",extensions:"jpg,jpeg"}]},
                chunk_size:0,init:{PostInit:function(){
                            $("#filelist .alert").addClass("hidden")},
                    FilesAdded:function(t,i){plupload.each(i,function(n){
                        var t=$("#filelist .progress.hidden").clone().removeClass("hidden");
                        $(t).attr("id",n.id);
                        $(t).attr("data-filename-orig",n.name);
                        $(t).attr("data-size",n.size);
                        $(t).find(".progress-bar").html(n.name+" (<b>"+plupload.formatSize(n.size)+"<\/b>)");
                        $("#filelist").append(t)});
                        $(".uploadbuttons").addClass("hidden");
                        n.start()},UploadProgress:function(n,t){$("#"+t.id).find(".progress-bar").attr("style","width:"+t.percent+"%")},
                    FileUploaded:function(n,t){
                            $("#"+t.id).removeClass("active").find(".progress-bar").append("<div class='pull-right mr5'>100%<\/div>")},
                    Error:function(n,t){
                                $("#filelist .alert").removeClass("hidden").html("\nError #"+t.code+": "+t.message)}}});
            n.init();
            n.bind("UploadComplete",onUploadComplete);
            n.bind("BeforeUpload",function(t,i){
                var r=new Date,
                    u=("0"+(parseInt(r.getMonth())+1)).slice(-2),f=r.getFullYear();
                n.settings.multipart_params.id_file=i.id;
                n.settings.multipart_params.key=f+"/"+u+"/"+i.id;
                $("div#"+i.id).attr("data-year",f).attr("data-month",u)});
            setTimeout(function(){
                $("#filelist").removeClass("hidden")},2e3)
        }

        function get_uploaded_fileinfo(){
            var n=[];
            return $("#filelist .progress:not(.hidden)").each(function(){
                n.push({id_file:$(this).attr("id"),
                    key:$(this).attr("data-year")+"/"+$(this).attr("data-month"),
                    filename_orig:$(this).attr("data-filename-orig"),
                    size:$(this).attr("data-size")})}),n
        }

        function onUploadComplete(){
            $.ajax({type:"POST",
                url:"/order/savedesignfiles",
                contentType:"application/json; charset=utf-8",
                data:JSON.stringify(get_uploaded_fileinfo()),
                dataType:"json",success:function(n){if(n.result!=0){alert(n.message);
                    return
                }
                $(".chk_confirm_order").removeClass("hidden")}})}get_components();initplupload()