'use client';

import { useContext, useState } from 'react';

import styled from 'styled-components';
import { Product, type Color } from 'types/productType';

import add from './add.png';
import minus from './minus.png';
import { CartItemsContext } from 'context/cartItemsContext';

const Option = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
`;

type OptionNameProp = {
  hideOnMobile: boolean;
};

const OptionName = styled.div<OptionNameProp>`
  line-height: 24px;
  font-size: 20px;
  letter-spacing: 4px;
  color: #3f3a3a;

  @media screen and (max-width: 1279px) {
    line-height: 17px;
    font-size: 14px;
    letter-spacing: 2.8px;

    ${(props) => props.hideOnMobile && 'display: none;'}
  }
`;

type ColorProp = {
  $isSelected: boolean;
  $colorCode: string;
};

const Color = styled.div<ColorProp>`
  width: 36px;
  height: 36px;
  padding: 6px;
  border: 6px solid white;
  box-shadow: 0px 0px 1px #bbbbbb;
  cursor: pointer;
  margin-left: 21px;
  background-color: ${(props) => props.$colorCode};
  ${(props) => props.$isSelected && 'outline: 1px solid #979797;'}

  & + & {
    margin-left: 15px;
  }
`;

type SizeProp = {
  $isSelected: boolean;
  $isDisabled: boolean;
};

const Size = styled.div<SizeProp>`
  width: 34px;
  height: 34px;
  background-color: ${(props) => (props.$isSelected ? 'black' : '#ececec')};
  color: ${(props) => (props.$isSelected ? 'white' : '#3f3a3a')};
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 22px;
  cursor: ${(props) => (props.$isDisabled ? ' not-allowed' : 'pointer')};
  ${(props) => props.$isDisabled && 'opacity: 0.25;'}

  & + & {
    margin-left: 20px;
  }
`;

const QuantitySelector = styled.div`
  margin-left: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 160px;
  height: 44px;
  padding: 0 10px;
  border: 1px solid #979797;
  font-size: 20px;

  @media screen and (max-width: 1279px) {
    margin-left: 0;
    width: 100%;
    padding: 0 30px;
  }
`;

const Quantity = styled.div`
  color: #8b572a;
`;

const Button = styled.div`
  cursor: pointer;
  background-size: contain;
  width: 16px;
  height: 16px;
`;

const DecrementButton = styled(Button)`
  background-image: url(${minus.src});
`;

const IncrementButton = styled(Button)`
  background-image: url(${add.src});
`;

const AddToCart = styled.button`
  width: 100%;
  height: 60px;
  margin-top: 29px;
  border: solid 1px #979797;
  background-color: black;
  font-size: 20px;
  letter-spacing: 4px;
  color: white;
  cursor: pointer;

  @media screen and (max-width: 1279px) {
    height: 44px;
    margin-top: 10px;
    font-size: 16px;
    letter-spacing: 3.2px;
    color: white;
  }
`;

function ProductVariants({ product }: any) {
  const [selectedColorCode, setSelectedColorCode] = useState(
    product.colors[0].code,
  );
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const cartItemsState = useContext(CartItemsContext);
  if (cartItemsState === undefined) {
    throw new Error('useContext must be used within a CartItemsProvider');
  }
  const cartItems: Product[] = cartItemsState[0];
  const setCartItems = cartItemsState[1];

  function getStock(colorCode: string, size: string) {
    return product.variants.find(
      (variant: { color_code: string; size: string }) =>
        variant.color_code === colorCode && variant.size === size,
    ).stock;
  }

  function addToCart() {
    if (!selectedSize) {
      window.alert('請選擇尺寸');
      return;
    }

    const newCartItems = [
      ...cartItems,
      {
        color: product.colors.find(
          (color: { code: string }) => color.code === selectedColorCode,
        ),
        id: product.id,
        image: product.main_image,
        name: product.title,
        price: product.price,
        qty: quantity,
        size: selectedSize,
        stock: getStock(selectedColorCode, selectedSize),
      },
    ];
    setCartItems(newCartItems);
    window.localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    window.alert('已加入商品');
  }
  return (
    <>
      <Option>
        <OptionName hideOnMobile>顏色｜</OptionName>
        {product.colors.map((color: Color) => (
          <Color
            key={color.code}
            $isSelected={color.code === selectedColorCode}
            $colorCode={`#${color.code}`}
            onClick={() => {
              setSelectedColorCode(color.code);
              setSelectedSize('');
              setQuantity(1);
            }}
          />
        ))}
      </Option>
      <Option>
        <OptionName hideOnMobile>尺寸｜</OptionName>
        {product.sizes.map((size: string) => {
          const stock = getStock(selectedColorCode, size);
          return (
            <Size
              key={size}
              $isSelected={size === selectedSize}
              $isDisabled={stock === 0}
              onClick={() => {
                const stock = getStock(selectedColorCode, size);
                if (stock === 0) return;
                setSelectedSize(size);
                if (stock < quantity) setQuantity(1);
              }}
            >
              {size}
            </Size>
          );
        })}
      </Option>
      <Option>
        <OptionName hideOnMobile>數量｜</OptionName>
        <QuantitySelector>
          <DecrementButton
            onClick={() => {
              if (!selectedSize || quantity === 1) return;
              setQuantity(quantity - 1);
            }}
          />
          <Quantity>{quantity}</Quantity>
          <IncrementButton
            onClick={() => {
              const stock = getStock(selectedColorCode, selectedSize);
              if (!selectedSize || quantity === stock) return;
              setQuantity(quantity + 1);
            }}
          />
        </QuantitySelector>
      </Option>
      <AddToCart onClick={addToCart}>
        {selectedSize ? '加入購物車' : '請選擇尺寸'}
      </AddToCart>
    </>
  );
}

export default ProductVariants;
