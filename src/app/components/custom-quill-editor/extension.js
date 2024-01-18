import Quill from 'quill';
import Parchment from 'parchment'

var ListItem = Quill.import('formats/list/item');

function camelize(name) {
  let parts = name.split('-');
  let rest = parts
    .slice(1)
    .map(function(part) {
      return part[0].toUpperCase() + part.slice(1);
    })
    .join('');
  return parts[0] + rest;
}

class ClassAttributor extends Parchment.Attributor.Class {
 
  static addWithoutCheck(attributor, node, value) {   
    let className = `${attributor.keyName}-${value}`;
    const fontBoldStyle = "ql-font-bold";
    const fontItalicStyle = "ql-font-italic";

    if(node.firstChild.outerHTML.indexOf('<em') == 0)
    {
      node.classList.contains(fontItalicStyle) ? '' : node.classList.add(fontItalicStyle);
    }   
    
    if(node.firstChild.outerHTML.indexOf('<strong') == 0)
    {
      if(node.firstChild.innerHTML.indexOf('<em') == 0)
      {
        node.classList.contains(fontItalicStyle) ? '' : node.classList.add(fontItalicStyle);
      }
      else {
      node.classList.contains(fontItalicStyle) ? node.classList.remove(fontItalicStyle) : '';
    }
      node.classList.contains(fontBoldStyle) ? '' : node.classList.add(fontBoldStyle);
    }
    else {
      node.classList.contains(fontBoldStyle) ? node.classList.remove(fontBoldStyle) : '';
    }

    if(node.classList.contains(className))
    return;

    this.prototype.remove.call(attributor, node);   
    node.classList.add(className);
    return true;
  }
}

class StyleAttributor extends Parchment.Attributor.Style {
 
  static addWithoutCheck(attributor, node, value) {
    let styleKey = attributor.keyName;
    if(node.style[camelize(styleKey)] ==value )
    return ;
    // @ts-ignore
    node.style[camelize(styleKey)] = value;
    return true;
  } 

}

class AttributorStore extends Parchment.Attributor.Store {
 
  attributeWithoutCheck(attribute, value) {
    // verb
    if (value) {
      if (attribute.addWithoutCheck(this.domNode, value)) {
        if (attribute.value(this.domNode) != null) {
          this.attributes[attribute.attrName] = attribute;
        } else {
          delete this.attributes[attribute.attrName];
        }
      }
    } else {
      attribute.remove(this.domNode);
      delete this.attributes[attribute.attrName];
    }
  }
}

 

class ListExt extends ListItem {

  // getAttributeValues(): { [key] } {
  //   return Object.keys(
  //     this.attributes,
  //   ).reduce((attributes: { [key] }, name) => {
  //     attributes[name] = this.attributes[name].value(this.domNode);
  //     return attributes;
  //   }, {});
  // }

  optimize(context) {
    super.optimize(context);  
    const validAttributes = ['size', 'font', 'color'];    
    if (this.children.length >= 1) {
      const child = this.children.head;
      const attributes = (child.attributes && child.attributes.attributes) || '';
      if(!attributes) return;
      for (let key in attributes) {
        if (validAttributes.indexOf(key) !== -1) {        
          this.attributes.attributes[key] = attributes[key];
          let value =  attributes[key].value(child.domNode);
          if(key ==  'color')
            StyleAttributor.addWithoutCheck(attributes[key],this.domNode, value);
            else 
            ClassAttributor.addWithoutCheck(attributes[key],this.domNode, value); 
           
          //        
        }
      }
      
    } else {     
      validAttributes.forEach((attribute) => {
        if (this.attributes && Object.prototype.hasOwnProperty.call(this.attributes, attribute)) {
          delete this.attributes.attributes[attribute];
        }
      });     
    }
  }  
}

export {ListExt}